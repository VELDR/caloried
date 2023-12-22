import FormFooter from '@components/forms/FormFooter';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  currentStep: 2,
  onContinue: jest.fn(),
};

beforeEach(() => {
  wrapper = render(<FormFooter {...mockProps} />);
});

describe('FormFooter Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;
    const nextButton = getByTestId('primary-button');

    expect(getByTestId('form-footer')).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should call onContinue when the next button is clicked', () => {
    const { getByTestId } = wrapper;
    const nextButton = getByTestId('primary-button');

    fireEvent.click(nextButton);

    expect(mockProps.onContinue).toHaveBeenCalled();
  });
  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
