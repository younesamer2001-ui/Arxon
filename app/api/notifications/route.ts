import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch notifications for a customer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const orderId = searchParams.get('order_id')
    const unreadOnly = searchParams.get('unread') === 'true'

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (orderId) {
      query = query.eq('order_id', orderId)
    }

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('customer_email', email)
      .eq('read', false)

    return NextResponse.json({ notifications: data, unread_count: count || 0 })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, customer_email, type, title, message, metadata } = body

    if (!customer_email || !type || !title || !message) {
      return NextResponse.json(
        { error: 'customer_email, type, title, and message are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        order_id,
        customer_email,
        type,
        title,
        message,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
    }

    return NextResponse.json({ notification: data })
  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notification_id, mark_all_read, customer_email } = body

    if (mark_all_read && customer_email) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('customer_email', customer_email)
        .eq('read', false)

      if (error) {
        console.error('Error marking all as read:', error)
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (notification_id) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notification_id)
        .select()
        .single()

      if (error) {
        console.error('Error marking as read:', error)
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
      }

      return NextResponse.json({ notification: data })
    }

    return NextResponse.json(
      { error: 'notification_id or mark_all_read with customer_email required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Notifications PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
