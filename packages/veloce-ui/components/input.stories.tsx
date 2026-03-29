import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Search, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "name@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10" />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="email" placeholder="Email" className="pl-10" />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="password" placeholder="Password" className="pl-10" />
      </div>
    </div>
  ),
};

const PasswordToggleComponent = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
};

export const PasswordToggle: Story = {
  render: () => <PasswordToggleComponent />,
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input placeholder="Default size" className="h-9" />
      <Input placeholder="Small size" className="h-8 text-sm" />
      <Input placeholder="Large size" className="h-11 text-base" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <Input placeholder="Normal input" />
      <Input placeholder="Invalid input" aria-invalid="true" />
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="Readonly input" readOnly />
    </div>
  ),
};

export const FileInput: Story = {
  args: {
    type: "file",
  },
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input id="name" placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" type="email" placeholder="john@example.com" />
        <p className="text-xs text-muted-foreground">
          We&apos;ll never share your email with anyone else.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" type="password" placeholder="••••••••" />
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters long.
        </p>
      </div>
    </div>
  ),
};

export const InFormLayout: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="first-name" className="text-sm font-medium">
            First Name
          </label>
          <Input id="first-name" placeholder="John" />
        </div>
        <div className="space-y-2">
          <label htmlFor="last-name" className="text-sm font-medium">
            Last Name
          </label>
          <Input id="last-name" placeholder="Doe" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <Input id="address" placeholder="123 Main St" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input id="city" placeholder="City" />
        </div>
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <Input id="state" placeholder="State" />
        </div>
        <div className="space-y-2">
          <label htmlFor="zip" className="text-sm font-medium">
            ZIP
          </label>
          <Input id="zip" placeholder="12345" />
        </div>
      </div>
    </div>
  ),
};
