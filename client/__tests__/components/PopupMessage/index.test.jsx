import PopupMessage from '@components/ui/PopupMessage/Dialog';
import { fireEvent, render } from '@utils/testHelper';

let isOpen = true;
let wrapper;

const mockProps = {
  open: isOpen,
  title: 'app_popup_error_title',
  message: 'app_popup_error_message',
  onClose: () => {
    isOpen = false;
  },
};

beforeEach(() => {
  wrapper = render(<PopupMessage {...mockProps} />);
});

describe('PopupMessage Component', () => {
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('error-popup')).toBeInTheDocument();
  });

  it('should close popup', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('error-popup-button');
    fireEvent.click(button);
    expect(isOpen).toBe(false);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
