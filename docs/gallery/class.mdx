---
sidebar_position: 2
title: Class
---

# Class diagrams

Class diagrams are laid out by **Graphviz**, which is compiled to JavaScript and bundled
alongside the PlantUML engine. That is why the runtime is two files: the diagram engine and
the layout engine. Both are served from this site's own origin.

```plantuml title="Order domain model"
@startuml
skinparam classAttributeIconSize 0

interface Clock {
  +now(): Instant
}

class OrderService {
  -repository: OrderRepository
  -clock: Clock
  +place(cart: Cart): Order
  +cancel(id: OrderId): void
}

class OrderRepository {
  +findById(id: OrderId): Order
  +save(order: Order): void
}

class Order {
  -id: OrderId
  -placedAt: Instant
  -lines: List<OrderLine>
  +total(): Money
}

class OrderLine {
  -sku: Sku
  -quantity: int
  -unitPrice: Money
}

class Money {
  -amount: BigDecimal
  -currency: Currency
}

OrderService --> OrderRepository
OrderService ..> Clock
OrderRepository --> Order
Order "1" *-- "many" OrderLine
OrderLine --> Money
@enduml
```

## Inheritance and abstract types

```plantuml title="Payment methods"
@startuml
abstract class PaymentMethod {
  #reference: String
  +{abstract} authorize(amount: Money): Authorization
  +describe(): String
}

class Card extends PaymentMethod {
  -last4: String
  -expiry: YearMonth
  +authorize(amount: Money): Authorization
}

class BankTransfer extends PaymentMethod {
  -iban: String
  +authorize(amount: Money): Authorization
}

class Wallet extends PaymentMethod {
  -provider: String
  +authorize(amount: Money): Authorization
}

interface Refundable {
  +refund(amount: Money): Refund
}

Card ..|> Refundable
Wallet ..|> Refundable
@enduml
```

## Packages

```plantuml title="Module boundaries"
@startuml
package "domain" {
  class Order
  class Money
}

package "application" {
  class OrderService
}

package "infrastructure" {
  class JpaOrderRepository
  class StripeGateway
}

OrderService --> Order
JpaOrderRepository ..> Order
StripeGateway ..> Money
@enduml
```
