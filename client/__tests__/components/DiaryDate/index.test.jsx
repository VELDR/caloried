import DiaryDate from '@components/diary/DiaryDate';

import { render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  currentDate: new Date('2023-01-01'),
  setCurrentDate: jest.fn(),
  intl: {
    formatMessage: jest.fn(),
  },
};

beforeEach(() => {
  wrapper = render(<DiaryDate {...mockProps} />);
});

describe('DiaryDate Component', () => {
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('diary-date')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
