import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NeedsOverview from './NeedsOverview';
import { convertToMultiNeed } from '../../utils/needConversion';
import type { HardshipNeedType, NeedItem } from '../../types/multiNeed';

interface NeedsInApplicationProps<TFormData> {
  formData: TFormData;
  needType: HardshipNeedType;
}

const cloneNeed = (need: NeedItem, index: number): NeedItem => ({
  ...need,
  id: `preview-${need.type}-${index}`,
  data: { ...(need.data as any) },
  payment: { ...need.payment },
  decision: { ...need.decision }
});

const NeedsInApplication = <TFormData,>({
  formData,
  needType
}: NeedsInApplicationProps<TFormData>) => {
  const navigate = useNavigate();

  const previewNeeds = useMemo(() => {
    const converted = convertToMultiNeed(formData, needType);
    return converted.needs.map((need, index) => cloneNeed(need, index));
  }, [formData, needType]);

  const handleAddNeed = () => {
    const multiNeedData = convertToMultiNeed(formData, needType);
    navigate('/multi-need', {
      state: {
        multiNeedData,
        autoOpenSelector: true
      }
    });
  };

  return (
    <NeedsOverview
      needs={previewNeeds}
      onRemoveNeed={() => {}}
      onAddNeed={handleAddNeed}
    />
  );
};

export default NeedsInApplication;

