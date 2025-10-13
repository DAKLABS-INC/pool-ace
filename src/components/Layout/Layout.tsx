import Header from "./Header";
import TrendingPoolsBar from "./TrendingPoolsBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <TrendingPoolsBar />
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;