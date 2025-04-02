import { baseOptions } from '@/app/layout.config';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <HomeLayout {...baseOptions}>
      {children}
      <Footer />
    </HomeLayout>
  );
}

function Footer(): React.ReactElement {
  return (
    <footer className="bg-fd-card text-fd-secondary-foreground mt-auto border-t p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold">Docs</p>
          <p className="text-xs">
            Built by{' '}
            <a
              href="https://meetingbaas.com/"
              rel="noreferrer noopener"
              target="_blank"
              className="font-medium"
            >
              Meeting BaaS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
