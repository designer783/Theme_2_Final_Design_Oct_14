import site from './site.json';

// Single source of truth for brand/contact details. Edit site.json to change them everywhere.
export const SITE = {
  ...site,
  url: `https://${site.domain}`,
  appUrl: `https://app.${site.domain}`,
  loginUrl: `https://${site.domain}/members/login`,
  phoneHref: `tel:${site.phone.replace(/[^\d+]/g, '')}`,
  emailHref: `mailto:${site.email}`,
  liveChatUrl: 'https://direct.lc.chat/17516280?utm_medium=chat&utm_campaign=link-shared-in-chat&utm_source=livechat.com&utm_content=specsheetonline.com',
};

export const SITE_CONFIG = {
  name: site.name,
  domain: site.domain,
  url: `https://${site.domain}/`,
  contact: {
    phone: site.phone,
    phoneHref: `tel:${site.phone.replace(/[^\d+]/g, '')}`,
    email: site.email,
    hours: "Open 24/7",
  },
} as const;

export const siteUrl = (path = "") => SITE_CONFIG.url + path.replace(/^\//, "");
