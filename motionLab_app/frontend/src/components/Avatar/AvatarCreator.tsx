import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';


interface AvatarCreatorWrapperProps {
    config: AvatarCreatorConfig;
    onAvatarExported: (event: AvatarExportedEvent) => void;
}

const subdomain = 'motion-i2jrhr';

// This component handles the AvatarCreator independently
const AvatarCreatorWrapper: React.FC<AvatarCreatorWrapperProps> = ({ config, onAvatarExported }) => {
    return (
        <div className="flex justify-center items-center w-full h-[80vh]">
            <AvatarCreator
                subdomain={subdomain}
                config={config}
                className="rounded-xl w-full h-full"
                onAvatarExported={onAvatarExported}
            />
        </div>
    );
};

export default AvatarCreatorWrapper;