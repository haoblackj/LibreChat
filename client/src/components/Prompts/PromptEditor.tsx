import { useMemo, memo } from 'react';
import { useRecoilValue } from 'recoil';
import { EditIcon } from 'lucide-react';
import type { PluggableList } from 'unified';
import rehypeHighlight from 'rehype-highlight';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import supersub from 'remark-supersub';
import ReactMarkdown from 'react-markdown';
import AlwaysMakeProd from '~/components/Prompts/Groups/AlwaysMakeProd';
import { code } from '~/components/Chat/Messages/Content/Markdown';
import { SaveIcon, CrossIcon } from '~/components/svg';
import { TextareaAutosize } from '~/components/ui';
import { PromptVariableGfm } from './Markdown';
import { PromptsEditorMode } from '~/common';
import { cn, langSubset } from '~/utils';
import { useLocalize } from '~/hooks';
import store from '~/store';

const { PromptsEditorMode, promptsEditorMode } = store;

type Props = {
  name: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const PromptEditor: React.FC<Props> = ({ name, isEditing, setIsEditing }) => {
  const localize = useLocalize();
  const { control } = useFormContext();
  const editorMode = useRecoilValue(promptsEditorMode);
  const { dirtyFields } = useFormState({ control: control });

  const EditorIcon = useMemo(() => {
    if (isEditing && !dirtyFields.prompt) {
      return CrossIcon;
    }
    return isEditing ? SaveIcon : EditIcon;
  }, [isEditing, dirtyFields.prompt]);

  const rehypePlugins: PluggableList = [
    [rehypeKatex, { output: 'mathml' }],
    [
      rehypeHighlight,
      {
        detect: true,
        ignoreMissing: true,
        subset: langSubset,
      },
    ],
  ];

  return (
    <div>
      <h2 className="flex items-center justify-between rounded-t-lg border border-gray-300 py-2 pl-4 text-base font-semibold dark:border-gray-600 dark:text-gray-200">
        {localize('com_ui_prompt_text')}
        <div className="flex flex-row gap-6">
          {editorMode === PromptsEditorMode.ADVANCED && (
            <AlwaysMakeProd className="hidden sm:flex" />
          )}
          <button type="button" onClick={() => setIsEditing((prev) => !prev)} className="mr-2">
            <EditorIcon
              className={cn(
                'icon-lg',
                isEditing ? 'p-[0.05rem]' : 'text-secondary-alt hover:text-text-primary',
              )}
            />
          </button>
        </div>
      </h2>
      <div
        className={cn(
          'min-h-[8rem] w-full rounded-b-lg border border-border-medium p-4 transition-all duration-150',
          { 'bg-surface-secondary-alt cursor-pointer hover:bg-surface-tertiary': !isEditing },
        )}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {!isEditing && (
          <EditIcon className="icon-xl absolute inset-0 m-auto hidden opacity-25 group-hover:block dark:text-gray-200" />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) =>
            isEditing ? (
              <TextareaAutosize
                {...field}
                className="w-full rounded border border-gray-300 bg-transparent px-2 py-1 focus:outline-none dark:border-gray-600 dark:text-gray-200"
                minRows={3}
                onBlur={() => setIsEditing(false)}
              />
            ) : (
              <ReactMarkdown
                remarkPlugins={[supersub, remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
                rehypePlugins={rehypePlugins}
                components={{ p: PromptVariableGfm, code }}
                className="markdown prose dark:prose-invert light my-1 w-full break-words text-text-primary"
              >
                {field.value}
              </ReactMarkdown>
            )
          }
        />
      </div>
    </div>
  );
};

export default memo(PromptEditor);
