import { render } from '@utils/testHelper';
import NutritionCard from '@components/NutritionCard';

const mockProps = {
  icon: 'http://localhost/path/to/icon.png',
  value: 100,
  label: 'Protein',
  unit: 'g',
};

let wrapper;

beforeEach(() => {
  wrapper = render(<NutritionCard {...mockProps} />);
});

describe('NutritionCard Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('nutrition-card')).toBeInTheDocument();
    expect(getByTestId('nutrition-card-value')).toHaveTextContent('100 g');
    expect(getByTestId('nutrition-card-label')).toHaveTextContent('Protein');
  });

  it('should display the correct icon', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('nutrition-card-icon').src).toBe('http://localhost/path/to/icon.png');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
