import { useEffect, useState } from 'octane';

type Props = {
  captureLabel: (view: any) => void;
  captureButton: (view: any) => void;
  captureScroll: (view: any) => void;
  mounted: () => void;
  disposed: () => void;
};

export function Counter(props: Props) @{
  const [count, setCount] = useState(0);
  useEffect(() => {
    props.mounted();
    return () => props.disposed();
  }, []);

  <masonview className="mason-core-hook-root">
    <label className="mason-core-hook-label" ref={props.captureLabel}
      text={`Count ${count}`} style={{ width: 90 + count * 40 }} />
    <button className="mason-core-hook-button" ref={props.captureButton}
      text="Increment core count" onTap={() => setCount((previous) => previous + 1)} />
    <scrollview className="mason-core-hook-viewport" ref={props.captureScroll}>
      <masonview className="mason-core-hook-content">
        @for (const row of Array.from({ length: 20 }, (_, index) => index); key row) {
          <label className="mason-core-hook-row" text={`Core scroll row ${row}`} />
        }
      </masonview>
    </scrollview>
  </masonview>
}
