// components/Avatar.tsx
interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    className?: string;
  }
  
  const Avatar = ({ src, alt, fallback, className = "" }: AvatarProps) => {
    return (
      <div 
        className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 ${className}`}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "User avatar"}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-blue-600">
            {fallback}
          </span>
        )}
      </div>
    );
  };
  
  export default Avatar;