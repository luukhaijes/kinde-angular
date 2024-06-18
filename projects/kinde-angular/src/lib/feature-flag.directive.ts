import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { KindeAngularService } from "./kinde-angular.service";

@Directive({ selector: '[featureFlag]', standalone: true })
export class FeatureFlagDirective implements OnInit {
  @Input()
  featureFlag!: string;
  @Input()
  featureFlagElse?: TemplateRef<unknown>;

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainerRef = inject(ViewContainerRef);
  private kindeAngularService = inject(KindeAngularService);

  async ngOnInit() {
    try {
      const featureFlag = await this.kindeAngularService.getFeatureFlag(this.featureFlag);
      featureFlag.value ? this.onIf() : this.onElse();
    } catch (error) {
      this.onElse();
    }
  }

  private onIf(): void {
    this.createView(this.templateRef);
  }

  private onElse(): void {
    if (!this.featureFlagElse) {
      return;
    }

    this.createView(this.featureFlagElse);
  }

  private createView(templateRef: TemplateRef<unknown>): void {
    this.viewContainerRef.createEmbeddedView(templateRef);
  }
}
