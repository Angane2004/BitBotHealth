import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            color: 'black'
        }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h1 style={{ fontSize: '6rem', fontWeight: 'bold', margin: 0 }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Page Not Found</h2>
                <p style={{ color: '#666', marginTop: '1rem' }}>
                    The page you are looking for does not exist.
                </p>
                <Link
                    href="/dashboard"
                    style={{
                        display: 'inline-block',
                        marginTop: '1.5rem',
                        padding: '12px 24px',
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none'
                    }}
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
