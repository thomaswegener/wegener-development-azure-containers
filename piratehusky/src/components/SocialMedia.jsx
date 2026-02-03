import { FaYoutube, FaFacebookF, FaInstagram } from 'react-icons/fa';

function SocialMedia() {
  return (
    <div className="text-center my-5">
      <h4 className="mb-4">Follow Pirate Husky on social media</h4>
      <div className="d-flex justify-content-center gap-4">
        <a
          href="https://www.youtube.com/@PirateHusky"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#FF0000',
            borderRadius: '50%',
            padding: '25px',
            width: '100px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaYoutube size={48} color="#fff" />
        </a>
        <a
          href="https://www.facebook.com/piratehusky"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#1877F2',
            borderRadius: '50%',
            padding: '25px',
            width: '100px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaFacebookF size={48} color="#fff" />
        </a>
        <a
          href="https://www.instagram.com/piratehusky"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#C13584',
            borderRadius: '50%',
            padding: '25px',
            width: '100px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaInstagram size={48} color="#fff" />
        </a>
      </div>
    </div>
  );
}

export default SocialMedia;
