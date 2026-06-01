export type BreadcrumbItem = {
  navs: string;
  url: string;
};

export type BreadcrumbProps = {
  isActive: boolean;
  items: BreadcrumbItem[];
};
