import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingBasket, Sparkles, Wind } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar>
          <SidebarHeader>
             <Link href="/" className="flex items-center gap-2 px-2">
                <Wind className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl font-headline">AromaCommerce</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/admin">
                        <SidebarMenuButton>
                            <LayoutDashboard/>
                            Dashboard
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/admin/products">
                        <SidebarMenuButton>
                            <ShoppingBasket/>
                            Products
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/admin/generate-description">
                        <SidebarMenuButton>
                            <Sparkles/>
                            AI Descriptions
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8 bg-secondary/30">
            {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
