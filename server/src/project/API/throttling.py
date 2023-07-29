from rest_framework.throttling import UserRateThrottle


class ResendEmailMessageThrottle(UserRateThrottle):
    rate = '1/s'

    def parse_rate(self, rate):
        return 1, 300
