from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import requests
from django.core.mail import EmailMultiAlternatives
from smtplib import SMTPException
from socket import timeout, gaierror
from .models import Orders,OrderDetails




def send_order_confirmation_email(order, recipient_email):
    items = OrderDetails.objects.filter(fk_order=order).select_related("fk_product")

    subject = f"Order Confirmed - #{order.order_number}"

    item_rows = ""

    for item in items:
        product_name = item.fk_product.vchr_name
        quantity = item.int_qty or 0
        price = item.dbl_ppu or 0
        total = item.dbl_total_amt or 0

        item_rows += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                {product_name}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
                {quantity}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                ₹{price:.2f}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                ₹{total:.2f}
            </td>
        </tr>
        """

    text_content = f"""
Hello {order.fk_user.first_name},

Thank you for your order!

Order Number: #{order.order_number}

Your order has been confirmed.

Items:
"""

    for item in items:
        text_content += f"""
{item.fk_product.vchr_name}
Quantity: {item.int_qty}
Price: ₹{item.dbl_ppu:.2f}
Total: ₹{item.dbl_total_amt:.2f}
"""

    text_content += f"""
Order Total: ₹{order.dbl_total_amt:.2f}

We'll notify you when your order has been shipped.

Thank you for shopping with us!
"""

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">

        <!-- HyperCart Logo -->
        <div style="
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 25px;
        ">
            <span style="color: rgb(234, 86, 32);">H</span><span style="color: #212529;">yperCart</span>
        </div>

        <h2>🎉 Order Confirmed!</h2>

        <p>Hello {order.fk_user.first_name},</p>

        <p>
            Thank you for your order. Your order has been confirmed.
        </p>

        <p>
            <strong>Order Number:</strong> #{order.order_number}<br>
            <strong>Order Date:</strong>
            {order.dat_order.strftime('%d %B %Y')}
        </p>

        <h3>Order Items</h3>

        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
            </thead>

            <tbody>
                {item_rows}
            </tbody>
        </table>

        <h3 style="text-align: right;">
            Order Total: ₹{order.dbl_total_amt:.2f}
        </h3>

        <p>
            We'll notify you when your order has been shipped.
        </p>

        <p>Thank you for shopping with us!</p>

    </body>
    </html>
    """

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )

    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=False)

    print(f"Email sent to {recipient_email}")

    return "Email sent"





@shared_task(autoretry_for=(SMTPException, timeout, gaierror,),retry_backoff=True,retry_backoff_max=30,retry_jitter=True)
def send_order_confirmation_email_task(order_id, recipient_email):
    order = Orders.objects.get(id=order_id)
    send_order_confirmation_email(order, recipient_email)

    