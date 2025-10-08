import Index from "./Index";
import MobileIndexSimple from "./MobileIndexSimple";
import { useIsMobile } from "@/hooks/use-mobile";

const ResponsiveIndex = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MobileIndexSimple /> : <Index />;
};

export default ResponsiveIndex;

