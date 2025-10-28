export default function JobStatusBadge({ status }: { status: string }) {
  const formatted =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const styles: Record<string, string> = {
    ACTIVE: "border border-[#B8DBCA] text-[#43936C] bg-[#F8FBF9]",
    INACTIVE: "border border-[#F5B1B7] text-[#E11428] bg-[#FFFAFA]",
    DRAFT: "border border-[#FEEABC] text-[#FBC037] bg-[#FFFCF5]",
  };

  const style =
    styles[status.toUpperCase()] ||
    "border border-gray-300 text-gray-600 bg-gray-50";

  return (
    <span
      className={`text-[14px] text-center w-[80px] font-bold py-[8px] px-[16px] rounded-[8px] ${style}`}
    >
      {formatted}
    </span>
  );
}
