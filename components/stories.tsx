import { ChevronRight } from 'lucide-react';
import { stories } from '@/lib/mock-data';
import Image from 'next/image';

export function Stories() {
  return (
    <div className="bg-card rounded-lg soft-shadow p-4 mb-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-2 min-w-max cursor-pointer group">
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-border group-hover:border-primary transition-colors">
            <div className="text-2xl">+</div>
          </div>
          <span className="text-xs text-muted-foreground font-medium max-w-[60px] text-center truncate">Your Story</span>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2 min-w-max cursor-pointer group">
            <div className={`relative h-16 w-16 rounded-full flex-shrink-0 border-2 transition-colors ${
              story.isViewed
                ? 'border-border'
                : 'border-primary group-hover:border-primary/80'
            }`}>
              <Image
                src={story.avatar}
                alt={story.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium max-w-[60px] text-center truncate">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
