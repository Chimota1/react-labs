type HeaderProps = {
  title: string
  subtitle: string
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="app-header">
      <p className="app-header__eyebrow">Навчальний планувальник</p>
      <h1>{title}</h1>
      <p className="app-header__subtitle">{subtitle}</p>
    </header>
  )
}

export default Header
