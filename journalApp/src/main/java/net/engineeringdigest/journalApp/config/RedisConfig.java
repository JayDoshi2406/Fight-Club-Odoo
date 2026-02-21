package net.engineeringdigest.journalApp.config;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import io.lettuce.core.TimeoutOptions;
import io.lettuce.core.resource.ClientResources;
import io.lettuce.core.resource.DnsResolvers;
import net.engineeringdigest.journalApp.messaging.RedisMessageSubscriber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

import java.net.URI;
import java.time.Duration;

@Configuration
public class RedisConfig {

    private static final Logger log = LoggerFactory.getLogger(RedisConfig.class);

    @Bean(destroyMethod = "shutdown")
    public ClientResources clientResources() {
        return ClientResources.builder()
                .dnsResolver(DnsResolvers.JVM_DEFAULT)
                .build();
    }

    @Bean
    public LettuceConnectionFactory redisConnectionFactory(RedisProperties redisProperties,
                                                           ClientResources clientResources) {
        String url = redisProperties.getUrl();
        URI uri = URI.create(url);

        boolean useSsl = uri.getScheme().equals("rediss");
        String host = uri.getHost();
        int port = uri.getPort();
        String password = null;
        if (uri.getUserInfo() != null) {
            String userInfo = uri.getUserInfo();
            int colonIdx = userInfo.indexOf(':');
            password = colonIdx >= 0 ? userInfo.substring(colonIdx + 1) : userInfo;
        }

        RedisStandaloneConfiguration standaloneConfig = new RedisStandaloneConfiguration(host, port);
        if (password != null) {
            standaloneConfig.setPassword(password);
        }

        SocketOptions socketOptions = SocketOptions.builder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        ClientOptions clientOptions = ClientOptions.builder()
                .socketOptions(socketOptions)
                .timeoutOptions(TimeoutOptions.enabled(Duration.ofSeconds(5)))
                .autoReconnect(true)
                .build();

        LettuceClientConfiguration.LettuceClientConfigurationBuilder builder =
                LettuceClientConfiguration.builder()
                        .clientResources(clientResources)
                        .clientOptions(clientOptions)
                        .commandTimeout(Duration.ofSeconds(5));
        if (useSsl) {
            builder.useSsl();
        }

        return new LettuceConnectionFactory(standaloneConfig, builder.build());
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }

    @Bean
    public ChannelTopic vehicleTopic() {
        return new ChannelTopic("vehicle.updated");
    }

    @Bean
    public ChannelTopic driverTopic() {
        return new ChannelTopic("driver.updated");
    }

    @Bean
    public ChannelTopic dashboardTopic() {
        return new ChannelTopic("dashboard.updated");
    }

    @Bean
    public MessageListenerAdapter messageListenerAdapter(RedisMessageSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "onMessage");
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter messageListenerAdapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer() {
            private volatile boolean started = false;

            @Override
            public void start() {
                // Start subscription on a daemon thread to avoid blocking app startup
                Thread starter = new Thread(() -> {
                    try {
                        super.start();
                        started = true;
                        log.info("Redis listener container started successfully");
                    } catch (Exception e) {
                        log.warn("Redis listener container failed to start: {}", e.getMessage());
                    }
                }, "redis-listener-starter");
                starter.setDaemon(true);
                starter.start();
            }

            @Override
            public boolean isRunning() {
                return started && super.isRunning();
            }
        };
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(messageListenerAdapter, vehicleTopic());
        container.addMessageListener(messageListenerAdapter, driverTopic());
        container.addMessageListener(messageListenerAdapter, dashboardTopic());
        container.setRecoveryInterval(5000L);
        container.setErrorHandler(t -> log.warn("Redis listener error: {}", t.getMessage()));
        return container;
    }
}

