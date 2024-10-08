import { useState } from 'react';
import { MenuItem } from '@headlessui/react';
import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons';
import type { FC } from 'react';
import { Spinner } from '~/components/svg';
import { cn } from '~/utils';

type MenuItemProps = {
  tag: string | React.ReactNode;
  selected: boolean;
  count?: number;
  handleSubmit: (tag?: string) => Promise<void>;
  icon?: React.ReactNode;
};

const BookmarkItem: FC<MenuItemProps> = ({ tag, selected, handleSubmit, icon, ...rest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const clickHandler = async () => {
    if (tag === 'New Bookmark') {
      await handleSubmit();
      return;
    }

    setIsLoading(true);
    await handleSubmit(tag as string);
    setIsLoading(false);
  };

  const breakWordStyle: React.CSSProperties = {
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  };

  const renderIcon = () => {
    if (icon) {
      return icon;
    }
    if (isLoading) {
      return <Spinner className="size-4" />;
    }
    if (selected) {
      return <BookmarkFilledIcon className="size-4" />;
    }
    return <BookmarkIcon className="size-4" />;
  };

  return (
    <MenuItem
      aria-label={tag as string}
      className={cn(
        'group flex w-full gap-2 rounded-lg p-2.5 text-sm text-text-primary transition-colors duration-200',
        selected ? 'bg-surface-hover' : 'data-[focus]:bg-surface-hover',
      )}
      {...rest}
      as="button"
      onClick={clickHandler}
    >
      <div className="flex grow items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {renderIcon()}
          <div style={breakWordStyle}>{tag}</div>
        </div>
      </div>
    </MenuItem>
  );
};

export default BookmarkItem;
