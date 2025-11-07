import { TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const format = 'HH:mm';

const days = ['월', '화', '수', '목', '금', '토', '일'];

interface OperatingHoursProps {
  openTime: Dayjs | null;
  closeTime: Dayjs | null;
  closedDays: string[];
  setOpenTime: (v: Dayjs | null) => void;
  setCloseTime: (v: Dayjs | null) => void;
  setClosedDays: (v: string[]) => void;
}

export default function OperatingHours({
  openTime,
  closeTime,
  closedDays,
  setOpenTime,
  setCloseTime,
  setClosedDays,
}: OperatingHoursProps) {
  const toggleDay = (day: string) => {
    if (closedDays.includes(day)) {
      setClosedDays(closedDays.filter(d => d !== day));
    } else {
      setClosedDays([...closedDays, day]);
    }
  };

  return (
    <div className="flex justify-between items-end gap-8 bg-white py-4">
      {/* 운영시간 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <label className="text-babgray-800 text-md font-medium">운영시간</label>
          <span className="text-bab-500">*</span>
        </div>

        <div className="flex items-center gap-3 w-[530px]">
          {/* 시작 시간 */}

          <TimePicker
            value={openTime}
            onChange={t => setOpenTime(t)}
            format={format}
            placeholder="오픈 시간"
            className="w-[250px] h-[44px] rounded-3xl border border-babgray-300 px-3"
            classNames={{ popup: { root: 'bab-time-picker-panel' } as any }}
            needConfirm={false}
          />

          <span className="text-babgray-600">~</span>

          {/* 종료 시간 */}
          <TimePicker
            value={closeTime}
            onChange={t => setCloseTime(t)}
            format={format}
            placeholder="마감 시간"
            className="w-[250px] h-[44px] rounded-3xl border border-babgray-300 px-3 focus:border-bab"
            classNames={{ popup: { root: 'bab-time-picker-panel' } as any }}
            needConfirm={false}
          />
        </div>
      </div>

      {/* 휴무일 */}
      <div className="flex flex-col gap-2 w-[530px]">
        <span className="text-md text-babgray-800">휴무일</span>
        <div className="flex gap-2 justify-start">
          {days.map(day => {
            const isSelected = closedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`w-11 h-11 rounded-xl flex justify-center items-center text-base font-medium transition 
                  ${
                    isSelected
                      ? 'bg-bab text-white border border-bab'
                      : 'border border-babgray-300 text-babgray-800 hover:bg-babgray-100'
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
