import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/analytics';

export default function ContactButtons({ className = "" }) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {/* Email */}
      <a
        className="btn btn-primary me-2"
        href="mailto:info@piratehusky.no"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('contact_click', { channel: 'email', source: 'contact_buttons' })}
      >
        {t('common.sendEmail')}
      </a>
      {/* Messenger */}
      <a
        className="btn btn-outline-primary me-2"
        href="https://m.me/piratehusky"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('contact_click', { channel: 'messenger', source: 'contact_buttons' })}
      >
        {t('common.messenger')}
      </a>
      {/* WhatsApp */}
      <a
        className="btn btn-success"
        style={{ color: '#fff', backgroundColor: '#25D366', borderColor: '#25D366' }}
        href="https://wa.me/4745380189"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('contact_click', { channel: 'whatsapp', source: 'contact_buttons' })}
      >
        {t('common.whatsapp')}
      </a>
    </div>
  );
}
