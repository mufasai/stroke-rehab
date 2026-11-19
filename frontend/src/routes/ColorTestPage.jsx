import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function ColorTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Stroke Hand Therapy
          </h1>
          <p className="text-muted-foreground">
            Color Palette Test - Medical-Friendly Design
          </p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles and variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Delete</Button>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Status Badges</CardTitle>
            <CardDescription>Movement quality indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Badge className="bg-success text-white">CORRECT</Badge>
              <Badge className="bg-warning text-white">INCOMPLETE</Badge>
              <Badge className="bg-error text-white">COMPENSATORY</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pasien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sesi Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                6 selesai, 6 scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rata-rata ROM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">+14%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Peningkatan minggu ini
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Color Palette Display */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Primary, Secondary, and Semantic Colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Primary Dark Green */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Primary (Dark Green - Rukana #34613A)</h3>
              <div className="flex gap-2 flex-wrap">
                <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center text-xs">100</div>
                <div className="w-20 h-20 bg-primary-300 rounded-lg flex items-center justify-center text-xs">300</div>
                <div className="w-20 h-20 bg-primary-400 rounded-lg flex items-center justify-center text-xs">400</div>
                <div className="w-20 h-20 bg-primary-500 rounded-lg flex items-center justify-center text-xs text-white">500</div>
                <div className="w-20 h-20 bg-primary-600 rounded-lg flex items-center justify-center text-xs text-white font-bold ring-2 ring-primary-700">600 (Main)</div>
                <div className="w-20 h-20 bg-primary-700 rounded-lg flex items-center justify-center text-xs text-white">700</div>
              </div>
            </div>

            {/* Secondary Slate Teal */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Secondary (Slate Teal - Rukana #5A7A7E)</h3>
              <div className="flex gap-2 flex-wrap">
                <div className="w-20 h-20 bg-secondary-100 rounded-lg flex items-center justify-center text-xs">100</div>
                <div className="w-20 h-20 bg-secondary-300 rounded-lg flex items-center justify-center text-xs">300</div>
                <div className="w-20 h-20 bg-secondary-400 rounded-lg flex items-center justify-center text-xs">400</div>
                <div className="w-20 h-20 bg-secondary-500 rounded-lg flex items-center justify-center text-xs text-white font-bold ring-2 ring-secondary-700">500 (Main)</div>
                <div className="w-20 h-20 bg-secondary-600 rounded-lg flex items-center justify-center text-xs text-white">600</div>
                <div className="w-20 h-20 bg-secondary-700 rounded-lg flex items-center justify-center text-xs text-white">700</div>
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Semantic Colors</h3>
              <div className="flex gap-2 flex-wrap">
                <div className="w-32 h-20 bg-success rounded-lg flex items-center justify-center text-white font-medium">Success (#8EBD55)</div>
                <div className="w-32 h-20 bg-warning rounded-lg flex items-center justify-center text-white font-medium">Warning (#FBAD4A)</div>
                <div className="w-32 h-20 bg-error rounded-lg flex items-center justify-center text-white font-medium">Error (#FF5070)</div>
              </div>
            </div>

            {/* Rukana Tokens */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Rukana Direct Palette (desa.*)</h3>
              <div className="flex gap-2 flex-wrap text-xs">
                <div className="w-28 h-16 bg-desa-dark-green text-white rounded-lg flex items-center justify-center font-medium">dark-green</div>
                <div className="w-28 h-16 bg-desa-soft-green text-white rounded-lg flex items-center justify-center font-medium">soft-green</div>
                <div className="w-28 h-16 bg-desa-foreshadow text-desa-dark-green border border-desa-dark-green/20 rounded-lg flex items-center justify-center font-medium">foreshadow</div>
                <div className="w-28 h-16 bg-desa-background text-foreground border border-border rounded-lg flex items-center justify-center font-medium">background</div>
                <div className="w-28 h-16 bg-desa-yellow text-white rounded-lg flex items-center justify-center font-medium">yellow</div>
                <div className="w-28 h-16 bg-desa-red text-white rounded-lg flex items-center justify-center font-medium">red</div>
                <div className="w-28 h-16 bg-desa-black text-white rounded-lg flex items-center justify-center font-medium">black</div>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default ColorTestPage
