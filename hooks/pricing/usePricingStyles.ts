export const getSeasonColor = (index: number) => {
  const colors = [
    "bg-red-50 border-red-200", // High season
    "bg-yellow-50 border-yellow-200", // Mid season 1
    "bg-blue-50 border-blue-200", // Low season
    "bg-green-50 border-green-200", // Mid season 2
  ]
  return colors[index] || "bg-gray-50 border-gray-200"
}

export const getSeasonBadgeColor = (index: number) => {
  const colors = [
    "bg-red-100 text-red-800", // High season
    "bg-yellow-100 text-yellow-800", // Mid season 1
    "bg-blue-100 text-blue-800", // Low season
    "bg-green-100 text-green-800", // Mid season 2
  ]
  return colors[index] || "bg-gray-100 text-gray-800"
}
