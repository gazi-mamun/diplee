import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';

export class EmailService {
  to: string;
  orderLink: string;
  content: object;
  from: string;

  constructor(email: string, orderLink: string) {
    this.to = email;
    this.orderLink = orderLink;
    this.content = {};
    this.from = `Diplee <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);
  }

  // .readFileSync(
  //   `${__dirname}/../../emails/orderNotification.html`,
  //   'utf-8',
  // )

  // .readFileSync(`${__dirname}/emails/orderNotification.html`, 'utf-8')

  // Send the actual email
  async send(template: string, subject: string) {
    let html: any;
    if (template === 'order-notification') {
      const source = fs
        .readFileSync(
          `${__dirname}/../../emails/orderNotification.html`,
          'utf-8',
        )
        .toString();
      const templateEmail = Handlebars.compile(source);
      const data = { email: this.to, orderLink: this.orderLink };

      html = templateEmail(data);
    }

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async orderNotification() {
    await this.send('order-notification', 'New Order!');
  }
}
