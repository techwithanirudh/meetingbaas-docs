'use client';
const emailAddress = 'hello@meetingbaas.com';
const subject = encodeURIComponent('Interest in Meeting BaaS Services');
const body = encodeURIComponent(`Hello Meeting BaaS Team,

We've read your documentation, and are interested in learning more about your services.

Best regards,
[Your Name]
[Your Position]
[Your Contact Information]
[Your Company Name]`);

const emailLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

export function ContactLink() {
  return <a href={emailLink}>Email</a>;
}
