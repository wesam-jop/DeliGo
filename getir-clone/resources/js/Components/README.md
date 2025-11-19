# Components Library

This directory contains reusable React components for the Getir Clone application.

## Available Components

### 1. HeroSection
A hero banner component with customizable title, subtitle, icon, and gradient colors.

```jsx
import { HeroSection } from '../Components';

<HeroSection
    title="Welcome to Our Service"
    subtitle="Get the best products delivered to your doorstep"
    icon={Store}
    gradientFrom="from-purple-600"
    gradientTo="to-purple-800"
    badges={[
        { icon: Clock, text: 'Fast Delivery' },
        { icon: Shield, text: 'Quality Guaranteed' }
    ]}
/>
```

**Props:**
- `title` (string): Main heading text
- `subtitle` (string, optional): Subtitle text
- `icon` (React component, optional): Icon component to display
- `gradientFrom` (string): Tailwind gradient start color class
- `gradientTo` (string): Tailwind gradient end color class
- `badges` (array, optional): Array of badge objects with icon and text
- `className` (string, optional): Additional CSS classes

### 2. StatsSection
Displays statistics in a grid layout with customizable colors.

```jsx
import { StatsSection } from '../Components';

<StatsSection
    stats={[
        { number: '1000+', label: 'Products' },
        { number: '24/7', label: 'Service' }
    ]}
    title="Our Achievements"
    subtitle="Numbers that speak for themselves"
    color="purple"
/>
```

**Props:**
- `stats` (array): Array of stat objects with number and label
- `title` (string, optional): Section title
- `subtitle` (string, optional): Section subtitle
- `color` (string): Color theme (purple, green, orange, blue, pink, red)
- `showTitle` (boolean, default: true): Whether to show title and subtitle
- `className` (string, optional): Additional CSS classes

### 3. FeaturesSection
Displays feature cards in a grid layout.

```jsx
import { FeaturesSection } from '../Components';

<FeaturesSection
    features={[
        {
            icon: Clock,
            title: 'Fast Delivery',
            description: 'Get your orders delivered quickly'
        }
    ]}
    title="Why Choose Us?"
    subtitle="We provide exceptional service"
    color="purple"
    columns={3}
    cardStyle="default"
/>
```

**Props:**
- `features` (array): Array of feature objects with icon, title, and description
- `title` (string, optional): Section title
- `subtitle` (string, optional): Section subtitle
- `color` (string): Color theme
- `columns` (number, default: 4): Number of columns in grid
- `cardStyle` (string, default: "default"): Card style (default, minimal, detailed)
- `showTitle` (boolean, default: true): Whether to show title and subtitle
- `className` (string, optional): Additional CSS classes

### 4. SearchFilterSection
A search and filter component for product listings.

```jsx
import { SearchFilterSection } from '../Components';

<SearchFilterSection
    onSearch={(filters) => console.log('Search:', filters)}
    onFilter={(filters) => console.log('Filter:', filters)}
    categories={categories}
    placeholder="Search products..."
    showCategories={true}
    showSort={true}
/>
```

**Props:**
- `onSearch` (function): Callback when search is performed
- `onFilter` (function): Callback when filters are applied
- `categories` (array): Array of category objects
- `placeholder` (string): Search input placeholder
- `showCategories` (boolean, default: true): Whether to show category filter
- `showSort` (boolean, default: true): Whether to show sort options
- `className` (string, optional): Additional CSS classes

### 5. CTASection
Call-to-action section with buttons and customizable styling.

```jsx
import { CTASection } from '../Components';

<CTASection
    title="Ready to Get Started?"
    subtitle="Download our app and start ordering now"
    primaryButton={{
        text: "Download App",
        href: "/download",
        icon: Package
    }}
    secondaryButton={{
        text: "Learn More",
        href: "/about",
        icon: Heart
    }}
    gradientFrom="from-purple-600"
    gradientTo="to-purple-800"
/>
```

**Props:**
- `title` (string): Main heading text
- `subtitle` (string, optional): Subtitle text
- `primaryButton` (object, optional): Primary button configuration
- `secondaryButton` (object, optional): Secondary button configuration
- `icon` (React component, optional): Icon component to display
- `gradientFrom` (string): Tailwind gradient start color class
- `gradientTo` (string): Tailwind gradient end color class
- `centered` (boolean, default: true): Whether content is centered
- `className` (string, optional): Additional CSS classes

### 6. PageHeader
A page header component with breadcrumbs and actions.

```jsx
import { PageHeader } from '../Components';

<PageHeader
    title="Dashboard"
    subtitle="Welcome to your account"
    breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Dashboard' }
    ]}
    actions={[
        {
            text: 'Add New',
            onClick: () => console.log('Add clicked'),
            variant: 'primary',
            icon: Plus
        }
    ]}
/>
```

**Props:**
- `title` (string): Page title
- `subtitle` (string, optional): Page subtitle
- `breadcrumbs` (array, optional): Array of breadcrumb objects
- `actions` (array, optional): Array of action button objects
- `className` (string, optional): Additional CSS classes

## Color Themes

All components support the following color themes:
- `purple` (default)
- `green`
- `orange`
- `blue`
- `pink`
- `red`

## Usage Examples

### Creating a Service Page
```jsx
import { HeroSection, StatsSection, FeaturesSection, CTASection } from '../Components';

export default function ServicePage() {
    return (
        <div>
            <HeroSection
                title="Our Service"
                subtitle="Get the best service"
                gradientFrom="from-green-600"
                gradientTo="to-green-800"
            />
            
            <StatsSection
                stats={[
                    { number: '1000+', label: 'Customers' },
                    { number: '99%', label: 'Satisfaction' }
                ]}
                color="green"
            />
            
            <FeaturesSection
                features={features}
                color="green"
                columns={3}
            />
            
            <CTASection
                title="Get Started Today"
                primaryButton={{
                    text: "Start Now",
                    href: "/register"
                }}
                gradientFrom="from-green-600"
                gradientTo="to-green-800"
            />
        </div>
    );
}
```

## Benefits

1. **Consistency**: All pages use the same design patterns
2. **Maintainability**: Changes to components affect all pages
3. **Reusability**: Components can be used across different pages
4. **Customization**: Flexible props allow for different variations
5. **Performance**: Optimized components with proper prop handling
