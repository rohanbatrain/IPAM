import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">IPAM</h3>
            <p className="text-sm text-muted-foreground">
              Hierarchical IP Allocation Management System for 10.X.Y.Z address space.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/countries" className="text-muted-foreground hover:text-foreground">
                  Countries
                </Link>
              </li>
              <li>
                <Link href="/dashboard/regions" className="text-muted-foreground hover:text-foreground">
                  Regions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/hosts" className="text-muted-foreground hover:text-foreground">
                  Hosts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/audit" className="text-muted-foreground hover:text-foreground">
                  Audit Log
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground">
                  Settings
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} IPAM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
