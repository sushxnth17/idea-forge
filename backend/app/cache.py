from cachetools import TTLCache

# Lightweight in-memory feed cache (TTL: 60 seconds, Cache Key: (page, limit))
feed_cache = TTLCache(maxsize=128, ttl=60)

# Lightweight in-memory trending ideas cache (TTL: 300 seconds, Cache Key: "trending")
trending_cache = TTLCache(maxsize=1, ttl=300)


def invalidate_feed_cache():
	"""
	Clears the public feed cache.
	Called when ideas are created, updated, or deleted.
	"""
	feed_cache.clear()


def invalidate_trending_cache():
	"""
	Clears the trending ideas cache.
	Called when likes, comments are added, or remixes are created.
	"""
	trending_cache.clear()
