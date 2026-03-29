import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Calendar,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Separator,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../index";
import {
  Plus,
  User,
  Settings,
  LogOut,
  Home,
  FileText,
  BarChart3,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";

// Demo page showcasing all veloce-ui components
export default function DemoPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [switchChecked, setSwitchChecked] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    new Date(),
  );
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Veloce UI Components Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive showcase of all UI components in the veloce-ui library
        </p>
      </header>

      {/* Button Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <Button data-testid="button-default">Default Button</Button>
              <Button variant="destructive" data-testid="button-destructive">
                Destructive
              </Button>
              <Button variant="outline" data-testid="button-outline">
                Outline
              </Button>
              <Button variant="secondary" data-testid="button-secondary">
                Secondary
              </Button>
              <Button variant="ghost" data-testid="button-ghost">
                Ghost
              </Button>
              <Button variant="link" data-testid="button-link">
                Link
              </Button>
              <Button size="sm" data-testid="button-sm">
                Small
              </Button>
              <Button size="lg" data-testid="button-lg">
                Large
              </Button>
              <Button size="icon" data-testid="button-icon">
                <Plus className="size-4" />
              </Button>
              <Button disabled data-testid="button-disabled">
                Disabled
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Input Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                data-testid="input-email"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                data-testid="input-password"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="disabled">Disabled</Label>
              <Input
                id="disabled"
                placeholder="Disabled input"
                disabled
                data-testid="input-disabled"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="error">Error State</Label>
              <Input
                id="error"
                placeholder="Error input"
                aria-invalid="true"
                data-testid="input-error"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Textarea Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Textarea</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                data-testid="textarea-default"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Select Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Select</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger id="framework" data-testid="select-trigger">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react" data-testid="select-item-react">
                    React
                  </SelectItem>
                  <SelectItem value="vue" data-testid="select-item-vue">
                    Vue
                  </SelectItem>
                  <SelectItem value="angular" data-testid="select-item-angular">
                    Angular
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Switch Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Switch</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Switch
                id="airplane-mode"
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
                data-testid="switch-default"
              />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Calendar Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
        <Card>
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md border"
              data-testid="calendar-default"
            />
          </CardContent>
        </Card>
      </section>

      {/* Card Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card data-testid="card-default">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                Card description goes here. This is some descriptive text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content area for main text.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Accept</Button>
            </CardFooter>
          </Card>
          <Card data-testid="card-simple">
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Minimal card without footer.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dialog Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dialog</h2>
        <Card>
          <CardContent className="pt-6">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="dialog-trigger">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-content">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="@johndoe" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>

      {/* Dropdown Menu Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dropdown Menu</h2>
        <Card>
          <CardContent className="pt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button data-testid="dropdown-trigger">
                  Open Menu <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56"
                data-testid="dropdown-content"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </section>

      {/* Sheet Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Sheet</h2>
        <Card>
          <CardContent className="pt-6">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button data-testid="sheet-trigger">Open Sheet</Button>
              </SheetTrigger>
              <SheetContent data-testid="sheet-content">
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="@peduarte" />
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setSheetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setSheetOpen(false)}>
                    Save changes
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </section>

      {/* Popover Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Popover</h2>
        <Card>
          <CardContent className="pt-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button data-testid="popover-trigger">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" data-testid="popover-content">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Dimensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the dimensions for the layer.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </section>

      {/* Separator Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Separator</h2>
        <Card>
          <CardContent className="pt-6">
            <div>
              <div className="text-sm">Before separator</div>
              <Separator className="my-4" data-testid="separator-default" />
              <div className="text-sm">After separator</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Skeleton Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Skeleton</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Skeleton
                className="h-12 w-12 rounded-full"
                data-testid="skeleton-avatar"
              />
              <div className="space-y-2">
                <Skeleton
                  className="h-4 w-[250px]"
                  data-testid="skeleton-text"
                />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Table Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Table</h2>
        <Card>
          <CardContent className="pt-6">
            <Table data-testid="table-default">
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV002</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$400.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Tabs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="account" data-testid="tabs-default">
              <TabsList>
                <TabsTrigger value="account" data-testid="tab-trigger-account">
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  data-testid="tab-trigger-password"
                >
                  Password
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  data-testid="tab-trigger-settings"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                      Make changes to your account here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Account tab content</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Password tab content</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Settings tab content</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Tooltip Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tooltip</h2>
        <Card>
          <CardContent className="pt-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button data-testid="tooltip-trigger">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent data-testid="tooltip-content">
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </section>

      {/* Avatar Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Avatar</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar data-testid="avatar-default">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar data-testid="avatar-fallback">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sidebar Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Sidebar</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px] border rounded-md overflow-hidden">
              <SidebarProvider>
                <Sidebar data-testid="sidebar-default">
                  <SidebarHeader>
                    <div className="flex items-center gap-2 px-4 py-2">
                      <span className="font-semibold">Veloce</span>
                    </div>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarGroup>
                      <SidebarGroupLabel>Menu</SidebarGroupLabel>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive>
                            <Home className="size-4" />
                            <span>Home</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <FileText className="size-4" />
                            <span>Documents</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <BarChart3 className="size-4" />
                            <span>Analytics</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <CalendarIcon className="size-4" />
                            <span>Calendar</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroup>
                  </SidebarContent>
                  <SidebarFooter>
                    <SidebarMenuButton>
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarFooter>
                </Sidebar>
              </SidebarProvider>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
