import { useEffect } from 'react';
import { AppProvider, useApp, FAM_SANS } from './AppContext.jsx';
import { SideNav, TopBar, MobileHeader, MobileNav } from './Nav.jsx';
import Dashboard from './screens/Dashboard.jsx';
import CalendarScreen from './screens/Calendar.jsx';
import ComposeScreen from './screens/Compose.jsx';
import QueueScreen from './screens/Queue.jsx';
import BulkDropScreen from './screens/BulkDrop.jsx';
import StoriesScreen from './screens/Stories.jsx';
import AnalyticsScreen from './screens/Analytics.jsx';
import InboxScreen from './screens/Inbox.jsx';
import LibraryScreen from './screens/Library.jsx';

// ── Placeholder screens (replaced screen-by-screen) ──────────────────────────
function PlaceholderScreen({ label }) {
  const { t } = useApp();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', color: t.muted, fontSize: 15, fontStyle: 'italic',
    }}>
      {label} — coming soon
    </div>
  );
}

// ── Screen router ─────────────────────────────────────────────────────────────
function ScreenRouter() {
  const { view } = useApp();
  const screens = {
    dashboard: () => <Dashboard/>,
    calendar:  () => <CalendarScreen/>,
    compose:   () => <ComposeScreen/>,
    bulk:      () => <BulkDropScreen/>,
    queue:     () => <QueueScreen/>,
    stories:   () => <StoriesScreen/>,
    analytics: () => <AnalyticsScreen/>,
    inbox:     () => <InboxScreen/>,
    library:   () => <LibraryScreen/>,
  };
  const Screen = screens[view] || screens.dashboard;
  return <Screen/>;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast() {
  const { toast, isMobile } = useApp();
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', bottom: isMobile ? 84 : 32, left: '50%', transform: 'translateX(-50%)',
      background: '#1e1810', color: '#fff', padding: '12px 20px', borderRadius: 12,
      fontSize: 13, fontWeight: 500, zIndex: 9999,
      boxShadow: '0 8px 24px rgba(0,0,0,.22)',
      borderLeft: `4px solid ${toast.color || '#3d6e54'}`,
      whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 32px)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideUp .2s ease',
    }}>
      {toast.msg}
    </div>
  );
}

// ── App shell ─────────────────────────────────────────────────────────────────
function Shell() {
  const { t, isMobile, isTablet } = useApp();

  return (
    <div style={{
      fontFamily: FAM_SANS,
      background: t.bg,
      color: t.text,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      fontSize: 14,
    }}>
      {/* Side nav — desktop & tablet */}
      {!isMobile && <SideNav collapsed={isTablet}/>}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {isMobile  && <MobileHeader/>}
        {!isMobile && <TopBar/>}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: isMobile ? '14px 16px 88px' : '24px 32px',
        }}>
          <ScreenRouter/>
        </div>
        {isMobile && <MobileNav/>}
      </div>

      {/* Toast notifications */}
      <Toast/>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <Shell/>
    </AppProvider>
  );
}
