import {
  CreateRouterPattern,
  CreateRouterRequest,
  CreateRouterResponse,
} from './CreateRouter';
import {
  CreateTransportPattern,
  CreateTransportRequest,
  CreateTransportResponse,
} from './CreateTransport';
import {
  ConnectTransportPattern,
  ConnectTransportRequest,
  ConnectTransportResponse,
} from './ConnectTransport';
import {
  CreateProducerPattern,
  CreateProducerRequest,
  CreateProducerResponse,
} from './CreateProducer';
import {
  CreateConsumerPattern,
  CreateConsumerRequest,
  CreateConsumerResponse,
} from './CreateConsumer';
import {
  FindProducerPattern,
  FindProducerRequest,
  FindProducerResponse,
} from './FindProducer';
import {GetRouterPattern, GetRouterRequest, GetRouterResponse} from './GetRouter';

export type Pattern =
  | CreateRouterPattern
  | CreateTransportPattern
  | ConnectTransportPattern
  | CreateProducerPattern
  | CreateConsumerPattern
  | GetRouterPattern
  | FindProducerPattern;

export {
  CreateRouterRequest,
  CreateRouterResponse,
  CreateTransportRequest,
  CreateTransportResponse,
  ConnectTransportRequest,
  ConnectTransportResponse,
  CreateProducerRequest,
  CreateProducerResponse,
  CreateConsumerRequest,
  CreateConsumerResponse,
  GetRouterRequest,
  GetRouterResponse,
  FindProducerRequest,
  FindProducerResponse,
};
