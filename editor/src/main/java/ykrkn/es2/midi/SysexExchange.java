package ykrkn.es2.midi;

import reactor.core.publisher.Mono;

public interface SysexExchange<T> {

    Mono<T> request();

}
