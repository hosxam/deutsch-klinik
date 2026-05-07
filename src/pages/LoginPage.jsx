import { switchProfile } from '../utils/store';

const profiles = [
  {
    id: 'hossam',
    icon: '🩺',
    name: 'Hossam',
    subtitle: 'Medical German • Orthopedics Track',
    accent: '#00f0ff',
  },
  {
    id: 'wife',
    icon: '🌸',
    name: 'Your Wife',
    subtitle: 'German Learning Partner',
    accent: '#8b5cf6',
  },
];

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(0, 240, 255, 0.16), transparent 30%), radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.18), transparent 28%), #060912',
        color: '#f8fbff',
      }}
    >
      <section className="w-full max-w-5xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.28em]" style={{ color: '#00f0ff' }}>
          Deutsch Klinik
        </p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Choose your study profile</h1>
        <p className="max-w-2xl mx-auto mb-10 text-base sm:text-lg" style={{ color: '#b9c3d6' }}>
          Your progress, mistakes, goals, and review queue stay separate on this device.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => switchProfile(profile.id)}
              className="group text-left rounded-2xl p-6 sm:p-8 transition-all duration-200"
              style={{
                backgroundColor: 'rgba(16,22,40,0.97)',
                border: `1px solid ${profile.accent}55`,
                boxShadow: `0 0 0 rgba(0,0,0,0)`,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.boxShadow = `0 0 34px ${profile.accent}33`;
                event.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                event.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span className="block text-5xl mb-5" aria-hidden="true">
                {profile.icon}
              </span>
              <span className="block text-2xl font-bold mb-2" style={{ color: profile.accent }}>
                {profile.name}
              </span>
              <span className="block text-sm sm:text-base" style={{ color: '#cbd5e1' }}>
                {profile.subtitle}
              </span>
              <span className="mt-6 inline-flex items-center text-sm font-semibold" style={{ color: '#f8fbff' }}>
                Continue locally
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-sm" style={{ color: '#8fa3bf' }}>
          Studying together since May 2026
        </p>
      </section>
    </main>
  );
}
