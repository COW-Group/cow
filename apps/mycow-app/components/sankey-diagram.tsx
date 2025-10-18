"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { sankey, sankeyLinkHorizontal } from "d3-sankey"

interface SankeyNode {
  name: string
  category: string
  value?: number
  color?: string // Added color property
  x0?: number
  x1?: number
  y0?: number
  y1?: number
}

// This is the type for links *before* D3 processes them (source/target are indices)
interface SankeyInputLink {
  source: number // Index into the nodes array
  target: number // Index into the nodes array
  value: number
  goalLinked?: string | null
  color?: string // Added color property for links
}

// This is the type for links *after* D3 processes them (source/target are node objects)
interface SankeyProcessedLink {
  source: SankeyNode
  target: SankeyNode
  value: number
  color?: string // D3 might add this, or we can derive it
  goalLinked?: string | null
  y0?: number
  y1?: number
  width?: number
}

interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyInputLink[] // Links now use indices
}

interface SankeyDiagramProps {
  data: SankeyData // This data will have links with indices
  width: number
  height: number
  onNodeClick?: (node: SankeyNode) => void
  onLinkClick?: (link: SankeyProcessedLink) => void // Callback receives processed link
  selectedLink?: SankeyProcessedLink | null // Selected link is processed link
}

export function SankeyDiagram({ data, width, height, onNodeClick, onLinkClick, selectedLink }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || width === 0 || height === 0) return

    // Clear previous diagram
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }

    // Determine text color based on current theme
    const isDarkMode = document.documentElement.classList.contains("dark")
    const textColor = isDarkMode ? "#fbf3e0" : "#1e293b" // cream-100 for dark, ink-800 for light

    // Create sankey generator
    // The generator will resolve numeric source/target to node objects internally
    const sankeyGenerator = sankey<SankeyNode, SankeyInputLink>() // Use SankeyInputLink here
      .nodeWidth(20)
      .nodePadding(10)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .iterations(32) // Increase iterations for better layout

    // Generate the sankey data
    // D3 will modify the nodes and links objects by adding layout properties (x0, y0, etc.)
    const { nodes, links } = sankeyGenerator({
      nodes: data.nodes.map((d) => ({ ...d })), // Deep copy nodes
      links: data.links.map((d) => ({ ...d })), // Deep copy links (with numeric source/target)
    }) as { nodes: SankeyNode[]; links: SankeyProcessedLink[] } // Cast to processed types

    // Function to get node color, prioritizing the node's own color property
    const getNodeColor = (d: SankeyNode) => {
      if (d.color) return d.color
      // Fallback to category-based color if node.color is not defined (shouldn't happen if data is consistent)
      switch (d.category) {
        case "income":
          return "#10b981" // emerald-500
        case "assets":
          return "#3b82f6" // blue-500
        case "expenses":
          return "#f97316" // orange-500
        case "liabilities":
          return "#8b5cf6" // purple-500
        case "goals":
          return "#eab308" // amber-500
        case "unaccounted": // New category for unaccounted flows
          return "#ef4444" // red-500
        default:
          return "#0000FF" // logo-blue
      }
    }

    // Add gradients to defs
    const defs = svg.append("defs")

    links.forEach((link, i) => {
      const sourceNode = link.source as SankeyNode
      const targetNode = link.target as SankeyNode

      // Use link's own color if provided, otherwise use gradient from source to target
      const linkColor = link.color || getNodeColor(sourceNode) // Prioritize link.color

      defs
        .append("linearGradient")
        .attr("id", `linkGradient-${i}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", sourceNode.x1!)
        .attr("y1", link.y0!)
        .attr("x2", targetNode.x0!)
        .attr("y2", link.y1!)
        .call((gradient) => gradient.append("stop").attr("offset", "0%").attr("stop-color", linkColor)) // Use linkColor
        .call((gradient) => gradient.append("stop").attr("offset", "100%").attr("stop-color", linkColor)) // Use linkColor
    })

    // Create node groups
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
      .on("click", (event, d) => {
        if (onNodeClick) {
          onNodeClick(d)
        }
      })
      .style("cursor", (d) =>
        onNodeClick && (d.category === "income" || d.category === "assets") ? "pointer" : "default",
      )

    // Add node rectangles
    node
      .append("rect")
      .attr("height", (d) => Math.max(1, d.y1! - d.y0!))
      .attr("width", (d) => d.x1! - d.x0!)
      .attr("fill", (d) => getNodeColor(d)) // Use specific node color
      .attr("opacity", 0.8)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("filter", "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))")

    // Add node labels
    node
      .append("text")
      .attr("x", (d) => (d.x0! < width / 2 ? 6 + (d.x1! - d.x0!) : -6)) // Use total width for positioning
      .attr("y", (d) => (d.y1! - d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end")) // Use total width for positioning
      .text((d) => `${d.name} ($${d.value?.toLocaleString()})`)
      .attr("fill", textColor) // Dynamically set text color
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("pointer-events", "none")

    // Create links
    const link = svg
      .append("g")
      .attr("fill", "none")
      .selectAll("g")
      .data(links)
      .join("g")
      .style("mix-blend-mode", "multiply")
      .on("click", (event, d) => {
        if (onLinkClick) {
          onLinkClick(d)
        }
      })
      .style("cursor", "pointer") // Make links clickable

    // Add link paths
    link
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d, i) => `url(#linkGradient-${i})`) // Use gradient for stroke
      .attr("stroke-width", (d) => Math.max(1, d.width || 0))
      .attr("stroke-opacity", (d) =>
        selectedLink &&
        (d.source as SankeyNode).name === (selectedLink.source as SankeyNode).name &&
        (d.target as SankeyNode).name === (selectedLink.target as SankeyNode).name
          ? 0.9 // Higher opacity for selected link
          : 0.5,
      )
      .attr("fill", "none")
      .attr("class", (d) =>
        selectedLink &&
        (d.source as SankeyNode).name === (selectedLink.source as SankeyNode).name &&
        (d.target as SankeyNode).name === (selectedLink.target as SankeyNode).name
          ? "sankey-link-selected" // Apply animation class
          : "",
      )

    // Add goal indicators for goal-linked flows
    link
      .filter((d) => d.goalLinked)
      .append("circle")
      .attr("cx", (d) => ((d.source as SankeyNode).x1! + (d.target as SankeyNode).x0!) / 2)
      .attr("cy", (d) => (d.y0! + d.y1!) / 2)
      .attr("r", 4)
      .attr("fill", "#eab308") // amber-500
      .attr("stroke", "white")
      .attr("stroke-width", 1)
  }, [data, width, height, onNodeClick, onLinkClick, selectedLink])

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-hidden">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}
