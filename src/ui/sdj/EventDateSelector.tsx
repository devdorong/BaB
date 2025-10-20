import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import type { Database } from '../../types/bobType';

const { RangePicker } = DatePicker;
type EventState = Database['public']['Tables']['events']['Row']['status'];
export type EventDateSelectorProps = {
  onSelect: (data: { start: string; end: string; status: string }) => void;
  startDate?: string | null;
  endDate?: string | null;
};

export default function EventDateSelector({
  onSelect,
  startDate,
  endDate,
}: EventDateSelectorProps) {
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [selectedStart, setSelectedStart] = useState<string | null>(startDate ?? null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(endDate ?? null);
  const today = dayjs();

  const handleChange = (values: [Dayjs | null, Dayjs | null] | null) => {
    if (!values) return;
    const [start, end] = values;

    const finalEnd = end ?? start!;
    setDates([start!, finalEnd]);

    let status: EventState = '예정';
    if (today.isBefore(start!, 'day')) status = '예정';
    else if (today.isAfter(finalEnd, 'day')) status = '종료';
    else status = '진행중';

    onSelect({
      start: start!.format('YYYY-MM-DD'),
      end: finalEnd.format('YYYY-MM-DD'),
      status,
    });
  };

  const label = dates
    ? dates[0].isSame(dates[1], 'day')
      ? `${dates[0].format('MM-DD(dd)')}`
      : `${dates[0].format('MM-DD(dd)')} ~ ${dates[1].format('MM-DD(dd)')}`
    : '이벤트 기간을 설정해주세요';

  useEffect(() => {
    setSelectedStart(startDate ?? null);
    setSelectedEnd(endDate ?? null);

    if (startDate && endDate) {
      setDates([dayjs(startDate), dayjs(endDate)]);
    }
  }, [startDate, endDate]);

  return (
    <div className="flex items-center gap-2 text-babgray-700">
      <RangePicker
        format="YYYY-MM-DD"
        value={dates ?? undefined}
        onChange={handleChange}
        placeholder={[label, '']}
        allowClear={false}
        className="cursor-pointer"
      />
    </div>
  );
}
