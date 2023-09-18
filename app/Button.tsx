import Spinner from './Spinner';

interface ButtonProps {
  Name: string;
  disabled?: boolean;
  title?: string;
  color?: string;
  isRunning?: boolean;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  onClick?: (event: any) => void;
}

function Button({
  onClick,
  Name,
  type,
  disabled = false,
  title = '',
  color = 'blue',
  isRunning = false,
  children,
}: ButtonProps) {
  if (title === '') {
    title = Name;
  }
  return (
    <><div
      className="rounded"
      style={{ order: '0', flex: '0 1 auto', alignSelf: 'auto', borderColor: 'transparent', backgroundColor: 'transparent' }}>
      <div className="w-full shadow flex rounded items-center">
        <div className="flex-1 relative flex items-center">
          <div className="text-sm font-medium text-gray-700 pl-4 pr-8 py-6 relative">
            <button
              className="button"
              type={type ?? 'button'}
              onClick={onClick}
              title={title === '' ? Name : title}
              style={{
                order: '0',
                marginTop: '10px',
                marginBottom: '10px',
                zIndex: 0,
                position: 'relative',
                backgroundColor: color,
              }}
              disabled={disabled}>
              {isRunning && <Spinner />}
              {!isRunning && Name}
            </button>
          </div>
        </div>
      </div>
    </div><>{children}</></>
  );
}

export default Button;
