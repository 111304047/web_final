import Link from "next/link";

export default function Icon({ items }) {
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-3 gap-4 ">
        {items.map((item, index) => (
          <Link key={index} href={item.path}>
            <div
              className="aspect-square p-4 text-[#314757] rounded shadow flex items-center justify-center text-center bg-cover bg-center hover:scale-105 transition-all backdrop-blur-lg"
              style={{
                backgroundImage: item.backgroundImage
                  ? `url(${item.backgroundImage})`
                  : "none",
                backgroundColor: item.backgroundImage ? "transparent" : "#3B82F6", // fallback color
              }}
            >
              
              {item.name}
              
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
