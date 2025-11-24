import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const companyId = user.id

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: partnerRows, error: partnerListError } = await supabaseAdmin
      .from("partners")
      .select("id, partner_company_id")
      .eq("owner_company_id", companyId)

    if (partnerListError) throw partnerListError

    const partnerIds = (partnerRows || []).map((partner) => partner.id)

    let offersQuery = supabaseAdmin
      .from("offers")
      .select(
        "id,title,category,status,start_date,end_date,redemptions,max_redemptions,partner_id,created_at",
      )
      .order("created_at", { ascending: false })

    if (partnerIds.length > 0) {
      offersQuery = offersQuery.in("partner_id", partnerIds)
    } else {
      offersQuery = offersQuery.eq("partner_id", companyId)
    }

    const [
      { data: offersData, error: offersError },
      { data: employeesData, error: employeesError },
      { count: partnersCount = 0, error: partnersError },
      { data: eventsData, error: eventsError },
    ] = await Promise.all([
      offersQuery,
      supabaseAdmin
        .from("employees")
        .select("id,name,email,role,status,created_at")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("partners")
        .select("id", { count: "exact", head: true })
        .eq("owner_company_id", companyId),
      supabaseAdmin
        .from("offer_events")
        .select("event_type, offer_id, employee_id, created_at")
        .eq("company_id", companyId)
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: false })
        .limit(5000),
    ])

    if (offersError) throw offersError
    if (employeesError) throw employeesError
    if (partnersError) throw partnersError
    if (eventsError) throw eventsError

    const offers = offersData || []
    const employees = employeesData || []
    const employeeIds = employees.map((employee) => employee.id).filter(Boolean)
    const offerEventStats = new Map<
      string,
      { impressions: number; clicks: number; events: typeof eventsData }
    >()

    const totalEventCounts = (eventsData || []).reduce(
      (acc, event) => {
        const stats = offerEventStats.get(event.offer_id) || {
          impressions: 0,
          clicks: 0,
          events: [],
        }
        if (event.event_type === "impression") {
          stats.impressions += 1
          acc.impressions += 1
        } else if (event.event_type === "click") {
          stats.clicks += 1
          acc.clicks += 1
        }
        stats.events.push(event)
        offerEventStats.set(event.offer_id, stats)
        return acc
      },
      { impressions: 0, clicks: 0 },
    )

    let coupons: { id: string; offer_id: string; employee_id: string; created_at: string }[] = []

    if (employeeIds.length > 0) {
      const { data: couponData, error: couponError } = await supabaseAdmin
        .from("coupons")
        .select("id,offer_id,employee_id,created_at")
        .in("employee_id", employeeIds)
        .order("created_at", { ascending: false })
        .limit(100)

      if (couponError) throw couponError
      coupons = couponData || []
    }

    const totalImpressions = totalEventCounts.impressions
    const totalClicks = totalEventCounts.clicks
    const conversionRate =
      totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(1)) : 0
    const activeOffers = offers.filter(
      (offer) => (offer.status || "").toLowerCase() === "active",
    ).length
    const totalCoupons = coupons.length

    const offerById = new Map(offers.map((offer) => [offer.id, offer.title]))
    const employeeEngagementMap = new Map<number, number>()
    coupons.forEach((coupon) => {
      employeeEngagementMap.set(
        coupon.employee_id as unknown as number,
        (employeeEngagementMap.get(coupon.employee_id as unknown as number) || 0) + 1,
      )
    })

    const offersWithMetrics = offers.map((offer) => {
      const stats = offerEventStats.get(offer.id) || { impressions: 0, clicks: 0 }
      return {
        ...offer,
        impression_events: stats.impressions,
        click_events: stats.clicks,
      }
    })

    const topOffers = [...offersWithMetrics]
      .sort(
        (a, b) =>
          (b.click_events ?? b.redemptions ?? 0) - (a.click_events ?? a.redemptions ?? 0),
      )
      .slice(0, 5)

    const engagedEmployees = employees
      .map((employee) => ({
        ...employee,
        engagements: employeeEngagementMap.get(employee.id) || 0,
      }))
      .sort((a, b) => b.engagements - a.engagements)
      .slice(0, 5)

    const recentEmployees = employees.slice(0, 5)

    const recentCoupons = coupons.slice(0, 5).map((coupon) => ({
      id: coupon.id,
      type: "coupon",
      title: `Coupon generated for ${offerById.get(coupon.offer_id) || "an offer"}`,
      description: "Employee claimed a perk",
      timestamp: coupon.created_at,
    }))

    const recentOffers = offers.slice(0, 5).map((offer) => ({
      id: offer.id,
      type: "offer",
      title: `New offer: ${offer.title}`,
      description: offer.category ? `Category: ${offer.category}` : "Offer created",
      timestamp: offer.created_at ?? offer.start_date ?? "",
    }))

    const recentEmployeeActivity = recentEmployees.map((employee) => ({
      id: employee.id.toString(),
      type: "employee",
      title: `${employee.name} joined`,
      description: `Role: ${employee.role}`,
      timestamp: employee.created_at || "",
    }))

    const recentEventActivity = (eventsData || [])
      .slice(0, 5)
      .map((event, index) => ({
        id: `${event.offer_id}-${event.event_type}-${index}`,
        type: event.event_type === "click" ? "coupon" : "offer",
        title:
          event.event_type === "click"
            ? `Offer clicked`
            : "Offer viewed",
        description: `Offer ID: ${event.offer_id}`,
        timestamp: event.created_at,
      }))

    const activityFeed = [
      ...recentOffers,
      ...recentCoupons,
      ...recentEmployeeActivity,
      ...recentEventActivity,
    ]
      .filter((item) => Boolean(item.timestamp))
      .sort(
        (a, b) =>
          new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime(),
      )
      .slice(0, 6)

    return NextResponse.json({
      metrics: {
        impressions: totalImpressions,
        clicks: totalClicks,
        conversionRate,
        activeOffers,
        employees: employees.length,
        partners: partnersCount,
        coupons: totalCoupons,
      },
      offers: {
        list: offersWithMetrics,
        top: topOffers,
      },
      employees: {
        recent: recentEmployees,
        engaged: engagedEmployees,
      },
      activity: activityFeed,
    })
  } catch (error) {
    console.error("Company analytics error:", error)
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 },
    )
  }
}

