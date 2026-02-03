
import { Property, EducationArticle, PropertyIdentifier, AssessmentIdentifier, TaxSale } from './types';

export const PROVINCE_MAP: Record<string, string> = {
  'AB': 'Alberta',
  'BC': 'British Columbia',
  'MB': 'Manitoba',
  'NB': 'New Brunswick',
  'NL': 'Newfoundland and Labrador',
  'NS': 'Nova Scotia',
  'ON': 'Ontario',
  'PE': 'Prince Edward Island',
  'QC': 'Quebec',
  'SK': 'Saskatchewan',
  'NT': 'Northwest Territories',
  'NU': 'Nunavut',
  'YT': 'Yukon'
};

const STATE_TO_JURIS_ID: Record<string, string> = {
  'AB': '1', 'BC': '2', 'MB': '3', 'NB': '4', 'NL': '5', 'NS': '6',
  'ON': '7', 'PE': '8', 'QC': '9', 'SK': '10', 'NT': '11', 'NU': '12', 'YT': '13'
};




