import moment from 'moment';

const formatDate = (data) => {
  const dataMoment = moment(data);
  return dataMoment.tz(process.env.TIMEZONE).format();
};

const somaData = (data, tempo, formato) => moment.tz(data, process.env.TIMEZONE).add(tempo, formato).format();

export default {
  formatDate,
  somaData,
};
