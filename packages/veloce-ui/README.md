# @mattofficial/veloce-ui

Veloce Design System UI components - a collection of reusable, accessible, and customizable React components built with Tailwind CSS and TypeScript.

## 📦 Installation

### Using GitHub Packages

The package is published to GitHub Packages. To install it, you need to configure npm to use the GitHub Packages registry for the `@mattofficial` scope.

#### 1. Configure npm registry for GitHub Packages

Create or update a `.npmrc` file in your project root:

```bash
@mattofficial:registry=https://npm.pkg.github.com
```

Or add the registry configuration to your project's `.npmrc`:

```
@mattofficial:registry=https://npm.pkg.github.com
```

#### 2. Authenticate with GitHub Packages

You need to authenticate with GitHub Packages. Create a personal access token with the `read:packages` scope:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `read:packages` scope
3. Add the token to your npm configuration:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@mattofficial
```

Or add it to your environment:

```bash
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

#### 3. Install the package

```bash
npm install @mattofficial/veloce-ui
```

Or with yarn:

```bash
yarn add @mattofficial/veloce-ui
```

## 🚀 Quick Start

```tsx
import { Button, Card, CardContent } from "@mattofficial/veloce-ui";

function App() {
  return (
    <Card>
      <CardContent>
        <h2>Welcome to Veloce UI</h2>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 📚 Available Components

### Basic Components

- `Button` - Customizable button with variants
- `Input` - Form input field
- `Textarea` - Multi-line text input
- `Label` - Form label
- `Switch` - Toggle switch

### Layout Components

- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription`, `CardFooter`, `CardAction`
- `Sidebar`, `SidebarProvider`, `SidebarContent`, `SidebarHeader`, `SidebarFooter`

### Navigation Components

- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`

### Overlay Components

- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`
- `Popover`, `PopoverTrigger`, `PopoverContent`
- `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`

### Data Display Components

- `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`
- `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`
- `ChartContainer`, `ChartTooltip`, `ChartLegend`, `ChartStyle`

### Form Components

- `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `FormField`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Calendar`, `CalendarDayButton`

### Utility Components

- `Separator` - Horizontal or vertical divider
- `Skeleton` - Loading skeleton placeholder
- `Tooltip` - Tooltip for hover information

### Hooks & Utilities

- `useIsMobile()` - Hook to detect mobile viewport
- `cn()` - Utility for conditional className merging

## 🎨 Styling

### Tailwind CSS Setup

The components are built with Tailwind CSS. Make sure your project has Tailwind CSS configured:

1. Install Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Update your `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Add the path to veloce-ui components
    "./node_modules/@mattofficial/veloce-ui/dist/**/*.{js,ts,jsx,tsx}",
    // Your project files
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Rest of your Tailwind config
};

export default config;
```

### CSS Variables

The components use CSS variables for theming. Import the CSS in your application:

```css
/* In your global CSS file */
@import "@mattofficial/veloce-ui/styles";
```

Or import it directly in your main entry file:

```typescript
import "@mattofficial/veloce-ui/styles";
```

### Customizing Theme

You can override CSS variables in your application:

```css
:root {
  --background: #ffffff;
  --foreground: #020817;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  /* Override other variables as needed */
}
```

## 🔧 Development

### Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/MattOfficial/veloce-ui.git
cd veloce-ui
```

2. Install dependencies:

```bash
npm install
```

3. Run Storybook for component development:

```bash
npm run storybook
```

4. Build the package:

```bash
npm run build
```

5. Run tests:

```bash
npm test
npm run test:watch  # For development
```

### Storybook

Storybook is available for component documentation and development:

```bash
npm run storybook  # Development server on http://localhost:6006
npm run build-storybook  # Build static Storybook site
```

### Testing

The project uses Jest and React Testing Library for testing:

```bash
npm test           # Run tests once
npm run test:watch # Watch mode for development
npm run test:coverage # Run tests with coverage report
```

## 📁 Project Structure

```
veloce-ui/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── styles/        # CSS styles
├── dist/              # Built package (generated)
├── .storybook/        # Storybook configuration
└── tests/             # Test files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new components
- Update Storybook stories
- Ensure components are accessible (ARIA attributes, keyboard navigation)
- Use Tailwind CSS for styling

## 📦 Publishing

### GitHub Actions CI/CD

The package uses GitHub Actions for automated testing and publishing:

1. **Test Workflow**: Runs on every pull request to ensure code quality
2. **Publish Workflow**: Automatically publishes to GitHub Packages when:
   - A new tag is pushed (e.g., `v1.0.0`)
   - Changes are pushed to the `main` branch

### Manual Publishing

1. Update version in `package.json`
2. Build the package: `npm run build`
3. Publish to GitHub Packages: `npm publish`

## 🔗 Links

- **GitHub Repository**: https://github.com/MattOfficial/veloce-ui
- **GitHub Packages**: https://github.com/MattOfficial/veloce-ui/packages
- **Issue Tracker**: https://github.com/MattOfficial/veloce-ui/issues
- **Storybook**: https://mattrofficial.github.io/veloce-ui (if deployed)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Component primitives from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)
- Date picking from [React Day Picker](https://react-day-picker.js.org/)

---

Built with ❤️ by Veloce Digital Garage
