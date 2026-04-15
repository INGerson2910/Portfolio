const screens = ['search', 'results', 'detail', 'checkout', 'confirmation', 'reservations'];

export function Header({ screen, setScreen, enabledScreens = {}, t }) {
  return (
    <header className="header">
      <div>
        <p className="brand">LumaStay</p>
        <h1>{t.screens[screen]}</h1>
      </div>

      <nav className="tabs">
        {screens.map((item) => {
          const enabled = enabledScreens[item];

          return (
            <button
              key={item}
              type="button"
              disabled={!enabled}
              onClick={() => enabled && setScreen(item)}
              className={`nav-tab ${screen === item ? 'active' : ''}`}
            >
              {t.screens[item]}
            </button>
          );
        })}
      </nav>
    </header>
  );
}