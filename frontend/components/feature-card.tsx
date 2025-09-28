import { FileText, ListFilter, Percent, Lightbulb } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  color: string
}

export default function FeatureCard({ title, description, icon, color }: FeatureCardProps) {
  const getIcon = (): JSX.Element => {
    const props = { className: "h-6 w-6", style: { color: "white" } }

    switch (icon) {
      case "FileText":
        return <FileText {...props} />
      case "ListFilter":
        return <ListFilter {...props} />
      case "Percent":
        return <Percent {...props} />
      case "Lightbulb":
        return <Lightbulb {...props} />
      default:
        return <FileText {...props} />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-start">
        <div className="rounded-lg p-3 mr-4" style={{ backgroundColor: color }}>
          {getIcon()}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#4E4C67] mb-2">{title}</h3>
          <p className="text-[#4E4C67]/70">{description}</p>
        </div>
      </div>
    </div>
  )
}
