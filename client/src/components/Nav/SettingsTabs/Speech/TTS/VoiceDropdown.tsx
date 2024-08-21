import { useRecoilValue } from 'recoil';
import {
  EdgeVoiceDropdown,
  BrowserVoiceDropdown,
  ExternalVoiceDropdown,
} from '~/components/Audio/Voices';
import store from '~/store';
import { TTSEndpoints } from '~/common';

const voiceDropdownComponentsMap = {
  [TTSEndpoints.edge]: EdgeVoiceDropdown,
  [TTSEndpoints.browser]: BrowserVoiceDropdown,
  [TTSEndpoints.external]: ExternalVoiceDropdown,
};

const getLocalVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    console.log('voices', voices);

    if (voices.length) {
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
    }
  });
};

type VoiceOption = {
  value: string;
  display: string;
};

export default function VoiceDropdown() {
  const engineTTS = useRecoilValue<string>(store.engineTTS);
  const VoiceDropdownComponent = voiceDropdownComponentsMap[engineTTS];

  return <VoiceDropdownComponent />;
}
