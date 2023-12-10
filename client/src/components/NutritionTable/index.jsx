import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const NutritionTable = ({
  foodDetails,
  servingCount,
  setServingCount,
  selectedServingSize,
  selectedServingUnit,
  selectedServingQty,
}) => {
  const { nutrients, servingWeight } = foodDetails || {};
  const roundValue = (value) => Math.round(value * 10) / 10;

  const handleServingCountChange = (event) => {
    const { value } = event.target;
    const count = value === '' ? '' : parseInt(value, 10);

    if (count > 1000) {
      setServingCount(1000);
    } else {
      setServingCount(count >= 0 ? count : '');
    }
  };

  let nutrientFactor;
  if (servingWeight) {
    nutrientFactor = (selectedServingSize / servingWeight) * servingCount;
  } else {
    nutrientFactor = servingCount;
  }

  const getNutrientValue = (nutrient) => (nutrient?.value ? roundValue(nutrient.value * nutrientFactor) : 0);
  const getNutrientDV = (nutrient) => (nutrient?.dv ? roundValue(nutrient.dv * nutrientFactor) : 0);

  return (
    <section className={classes.performanceFacts}>
      <header className={classes.performanceFactsHeader}>
        <h1 className={classes.performanceFactsTitle}>
          <FormattedMessage id="app_nutrition_facts" />
        </h1>
        <div className={classes.servingSizeTitle}>
          <FormattedMessage id="app_serving_size" />:
        </div>
        <div className={classes.servingSize}>
          <input
            type="number"
            value={servingCount}
            onChange={handleServingCountChange}
            className={classes.servingCountInput}
            min="1"
            max="10"
          />
          <span>
            {servingCount} × {selectedServingSize}g ({selectedServingQty} {selectedServingUnit})
          </span>
        </div>
      </header>
      <table className={classes.performanceFactsTable}>
        <thead>
          <tr>
            <th colSpan="3">
              <FormattedMessage id="app_amount_per_serving" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.calories}>
            <th colSpan="2" className={classes.calories__label}>
              <FormattedMessage id="app_calories" />
            </th>
            <td className={classes.calories__value}>{getNutrientValue(nutrients?.calories) || 'N/A'}</td>
          </tr>
          <tr className={classes.thickRow}>
            <td colSpan="3" className={classes.dailyValue}>
              <span>
                % <FormattedMessage id="app_daily_value" />*
              </span>
            </td>
          </tr>

          <tr>
            <th colSpan="2">
              <span>
                <FormattedMessage id="app_total_fat" />
              </span>{' '}
              {getNutrientValue(nutrients?.fat)}g
            </th>
            <td>
              <span>{getNutrientDV(nutrients?.fat)}%</span>
            </td>
          </tr>

          <tr>
            <td className={classes.blankCell}> </td>
            <th>
              <FormattedMessage id="app_saturated_fat" /> {getNutrientValue(nutrients?.saturatedFat)}g
            </th>
            <td>
              <span>{getNutrientDV(nutrients?.saturatedFat)}%</span>
            </td>
          </tr>

          <tr>
            <td className={classes.blankCell}> </td>
            <th>
              <FormattedMessage id="app_trans_fat" /> {getNutrientValue(nutrients?.transFat)}g
            </th>
            <td> </td>
          </tr>
          <tr>
            <td className={classes.blankCell}> </td>
            <th>
              <FormattedMessage id="app_polyunsaturated_fat" /> {getNutrientValue(nutrients?.polyunsaturatedFat)}g
            </th>
            <td> </td>
          </tr>
          <tr>
            <td className={classes.blankCell}> </td>
            <th>
              <FormattedMessage id="app_monounsaturated_fat" /> {getNutrientValue(nutrients?.monounsaturatedFat)}g
            </th>
            <td> </td>
          </tr>

          <tr>
            <th colSpan="2">
              <span>
                <FormattedMessage id="app_cholesterol" />
              </span>{' '}
              {getNutrientValue(nutrients?.cholesterol)}mg
            </th>
            <td>
              <span>{getNutrientDV(nutrients?.cholesterol)}%</span>
            </td>
          </tr>

          <tr>
            <th colSpan="2">
              <span>
                <FormattedMessage id="app_sodium" />
              </span>{' '}
              {getNutrientValue(nutrients?.sodium)}mg
            </th>
            <td>
              <span>{getNutrientDV(nutrients?.sodium)}%</span>
            </td>
          </tr>

          <tr>
            <th colSpan="2">
              <span>
                <FormattedMessage id="app_total_carbohydrate" />
              </span>{' '}
              {getNutrientValue(nutrients?.carbs)}g
            </th>
            <td>
              <span>{getNutrientDV(nutrients?.carbs)}%</span>
            </td>
          </tr>

          <tr>
            <td className={classes.blankCell}> </td>
            <th>
              <FormattedMessage id="app_dietary_fiber" /> {getNutrientValue(nutrients?.fiber)}g
            </th>
            <td>
              <span>{getNutrientDV(nutrients?.fiber)}%</span>
            </td>
          </tr>
          <tr>
            <td className={classes.blankCell}> </td>
            <th>
              <FormattedMessage id="app_total_sugars" /> {getNutrientValue(nutrients?.sugar)}g
            </th>
            <td> </td>
          </tr>

          <tr className={classes.thickEnd}>
            <th colSpan="2">
              <span>
                <FormattedMessage id="app_protein" />
              </span>{' '}
              {getNutrientValue(nutrients?.protein)}g
            </th>
            <td> </td>
          </tr>
        </tbody>
      </table>

      <table className={classes.performanceFactsTableGrid}>
        <tbody>
          <tr>
            <td colSpan="2">
              <div>
                <FormattedMessage id="app_vitamin_d" /> {getNutrientValue(nutrients?.vitaminD)}mcg
              </div>{' '}
              <div>{getNutrientDV(nutrients?.vitaminD)}%</div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div>
                <FormattedMessage id="app_calcium" /> {getNutrientValue(nutrients?.calcium)}mg
              </div>{' '}
              <div>{getNutrientDV(nutrients?.calcium)}%</div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div>
                <FormattedMessage id="app_iron" /> {getNutrientValue(nutrients?.iron)}mg
              </div>{' '}
              <div>{getNutrientDV(nutrients?.iron)}%</div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div>
                <FormattedMessage id="app_potassium" /> {getNutrientValue(nutrients?.potassium)}mg
              </div>{' '}
              <div>{getNutrientDV(nutrients?.potassium)}%</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={classes.footnote}>
        <FormattedMessage id="app_table_info" />
      </div>
      <div className={classes.smallInfo}>
        <div>
          <FormattedMessage id="app_calories_per_gram" />:
        </div>
        <div className={classes.macros}>
          <FormattedMessage id="app_fat" /> 9 &bull; <FormattedMessage id="app_carbs" /> 4 &bull;{' '}
          <FormattedMessage id="app_protein" /> 4
        </div>
      </div>
    </section>
  );
};

NutritionTable.propTypes = {
  foodDetails: PropTypes.object,
  servingCount: PropTypes.number,
  setServingCount: PropTypes.func,
  selectedServingSize: PropTypes.number,
  selectedServingUnit: PropTypes.string,
  selectedServingQty: PropTypes.number,
};

export default NutritionTable;
